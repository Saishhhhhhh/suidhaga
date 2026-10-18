const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      sparse: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Ethnic Wear',
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    fabric: {
      type: String,
      default: 'Pure Silk Blend',
    },
    stock: {
      type: Number,
      default: 15,
      min: 0,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      default: function () {
        return 'SD-' + Math.floor(1000 + Math.random() * 9000);
      },
    },
    wpId: {
      type: String,
      default: null,
    },
    wpSource: {
      type: String,
      enum: ['manual', 'wordpress_api', 'wordpress_csv', 'seed'],
      default: 'manual',
    },
  },
  {
    timestamps: true,
  }
);

function slugify(text) {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.floor(100 + Math.random() * 900)
  );
}

// Auto-generate slug and discount before saving
productSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.title);
  }

  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.discount = 0;
  }
});

productSchema.statics.createSlug = slugify;

module.exports = mongoose.model('Product', productSchema);
