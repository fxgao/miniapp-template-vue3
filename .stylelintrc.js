module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-no-unsupported-browser-features',
    'stylelint-config-html'
  ],
  plugins: ['stylelint-scss', 'stylelint-declaration-block-no-ignored-properties'],
  customSyntax: 'postcss-html',
  rules: {
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'font-family-no-missing-generic-family-keyword': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-pseudo-element-no-unknown': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page', 'swiper', 'swiper-item', '/view/', '&']
      }
    ],
    'color-hex-length': 'long',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'each',
          'else',
          'extend',
          'for',
          'function',
          'if',
          'include',
          'mixin',
          'return',
          'while'
        ]
      }
    ]
  },
  ignoreFiles: ['**/*.js']
};
