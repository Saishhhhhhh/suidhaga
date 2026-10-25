const axios = require('axios');

/**
 * PhonePe Standard Checkout V2 Service
 * Official Documentation: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-integration-website
 */

class PhonePeService {
  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID || 'SU2601211253462517219180';
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || '6b3d01f9-d01a-4627-a519-5a5b28d541fb';
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || 'M23I7XG44NMD3';
    this.merchantName = process.env.PHONEPE_MERCHANT_NAME || 'SUI DHAGA';
    this.clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    this.env = process.env.PHONEPE_ENV || 'production'; // 'production' or 'sandbox'

    // Token caching
    this.cachedToken = null;
    this.tokenExpiry = 0;
  }

  // Update config dynamically (e.g. from Admin panel)
  updateConfig({ clientId, clientSecret, merchantId, merchantName, clientVersion, env }) {
    if (clientId) this.clientId = clientId.trim();
    if (clientSecret) this.clientSecret = clientSecret.trim();
    if (merchantId) this.merchantId = merchantId.trim();
    if (merchantName) this.merchantName = merchantName.trim();
    if (clientVersion) this.clientVersion = clientVersion.toString().trim();
    if (env) this.env = env.trim().toLowerCase();

    // Reset token on config update
    this.cachedToken = null;
    this.tokenExpiry = 0;
  }

  getConfig() {
    return {
      clientId: this.clientId,
      // Mask secret for safety
      clientSecretMasked: this.clientSecret
        ? `${this.clientSecret.slice(0, 8)}...${this.clientSecret.slice(-4)}`
        : '',
      hasClientSecret: Boolean(this.clientSecret),
      merchantId: this.merchantId,
      merchantName: this.merchantName,
      clientVersion: this.clientVersion,
      env: this.env,
      status: 'ACTIVE',
    };
  }

  getBaseUrls() {
    if (this.env === 'production') {
      return {
        oauth: 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
        pay: 'https://api.phonepe.com/apis/pg/checkout/v2/pay',
        orderStatus: (orderId) => `https://api.phonepe.com/apis/pg/checkout/v2/order/${orderId}/status`,
      };
    } else {
      return {
        oauth: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
        pay: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
        orderStatus: (orderId) => `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${orderId}/status`,
      };
    }
  }

  /**
   * Step 1: Generate / Retrieve Cached OAuth Token
   */
  async getAuthToken(forceRefresh = false) {
    const now = Math.floor(Date.now() / 1000);
    // Return cached token if valid for at least 60 more seconds
    if (!forceRefresh && this.cachedToken && this.tokenExpiry > now + 60) {
      return this.cachedToken;
    }

    const { oauth: oauthUrl } = this.getBaseUrls();
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_version', this.clientVersion);
    params.append('client_secret', this.clientSecret);
    params.append('grant_type', 'client_credentials');

    try {
      const response = await axios.post(oauthUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      });

      if (response.data && response.data.access_token) {
        this.cachedToken = response.data.access_token;
        const expiresIn = response.data.expires_in || 3600;
        this.tokenExpiry = now + expiresIn;
        return this.cachedToken;
      } else {
        throw new Error('Failed to retrieve access_token from PhonePe response');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data || error.message;
      console.error('PhonePe OAuth Error:', errMsg);
      throw new Error(`PhonePe Authentication Failed: ${typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg}`);
    }
  }

  /**
   * Step 2: Create Checkout Session (/checkout/v2/pay)
   * Amount in Rupees will be converted to Paise (amount * 100)
   */
  async createPayment({ merchantOrderId, amountInRupees, customer, redirectUrl, message }) {
    const token = await this.getAuthToken();
    const { pay: payUrl } = this.getBaseUrls();

    // Convert amount to paise (integer)
    const amountInPaise = Math.round(Number(amountInRupees) * 100);

    const payload = {
      merchantOrderId: merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200, // 20 minutes expiration
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: message || `Sui Dhaga Order ${merchantOrderId}`,
        merchantUrls: {
          redirectUrl: redirectUrl,
        },
      },
      metaInfo: {
        customerName: customer?.name || '',
        customerEmail: customer?.email || '',
        customerPhone: customer?.phone || '',
        udf1: merchantOrderId,
      },
    };

    try {
      const response = await axios.post(payUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `O-Bearer ${token}`,
          'X-MERCHANT-ID': this.merchantId,
        },
        timeout: 15000,
      });

      const data = response.data;
      if (data && data.redirectUrl) {
        return {
          success: true,
          orderId: data.orderId,
          merchantOrderId: merchantOrderId,
          state: data.state,
          redirectUrl: data.redirectUrl,
          expireAt: data.expireAt,
        };
      } else {
        throw new Error(data.message || 'PhonePe did not return a checkout redirectUrl');
      }
    } catch (error) {
      const errData = error.response?.data || error.message;
      console.error('PhonePe Pay Error:', errData);
      throw new Error(
        typeof errData === 'object' ? errData.message || JSON.stringify(errData) : errData
      );
    }
  }

  /**
   * Step 3: Check Order Status (/checkout/v2/order/{merchantOrderId}/status)
   */
  async checkOrderStatus(merchantOrderId) {
    const token = await this.getAuthToken();
    const { orderStatus: orderStatusUrl } = this.getBaseUrls();
    const targetUrl = orderStatusUrl(merchantOrderId);

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `O-Bearer ${token}`,
          'X-MERCHANT-ID': this.merchantId,
        },
        timeout: 10000,
      });

      const data = response.data;
      return {
        success: true,
        merchantId: data.merchantId,
        merchantOrderId: data.merchantOrderId,
        orderId: data.orderId,
        state: data.state, // 'COMPLETED' | 'PENDING' | 'FAILED'
        amount: data.amount ? data.amount / 100 : 0, // In Rupees
        currency: data.currency || 'INR',
        paymentDetails: data.paymentDetails || [],
        raw: data,
      };
    } catch (error) {
      const errData = error.response?.data || error.message;
      console.error('PhonePe Status Check Error:', errData);
      return {
        success: false,
        error: typeof errData === 'object' ? errData.message || JSON.stringify(errData) : errData,
        state: 'UNKNOWN',
      };
    }
  }

  /**
   * Diagnostic Test for Admin Panel
   */
  async testConnection(customConfig = null) {
    const startTime = Date.now();
    const previousState = {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      clientVersion: this.clientVersion,
      merchantId: this.merchantId,
      env: this.env,
    };

    if (customConfig) {
      if (customConfig.clientId) this.clientId = customConfig.clientId.trim();
      if (customConfig.clientSecret) this.clientSecret = customConfig.clientSecret.trim();
      if (customConfig.merchantId) this.merchantId = customConfig.merchantId.trim();
      if (customConfig.clientVersion) this.clientVersion = customConfig.clientVersion.toString().trim();
      if (customConfig.env) this.env = customConfig.env.trim().toLowerCase();
    }

    try {
      // Force new token creation to test live authentication
      const token = await this.getAuthToken(true);
      const latencyMs = Date.now() - startTime;

      return {
        success: true,
        latencyMs,
        merchantId: this.merchantId,
        merchantName: this.merchantName,
        env: this.env,
        message: 'PhonePe PG Live Credentials Verified Successfully!',
        tokenPrefix: token ? `${token.slice(0, 15)}...` : '',
      };
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        message: err.message,
      };
    } finally {
      if (customConfig && !customConfig.persist) {
        // Restore if only testing preview
        this.clientId = previousState.clientId;
        this.clientSecret = previousState.clientSecret;
        this.clientVersion = previousState.clientVersion;
        this.merchantId = previousState.merchantId;
        this.env = previousState.env;
      }
    }
  }
}

// Export singleton instance
module.exports = new PhonePeService();
