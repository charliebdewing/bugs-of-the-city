module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  rules: {
    'number-no-trailing-zeros': null,
    'max-empty-lines': 2,
    'max-nesting-depth': 2,
    'comment-empty-line-before': null,
    'no-empty-source': null,
    'no-eol-whitespace': [true, { ignore: ['empty-lines'] }],
    'at-rule-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-list-comma-newline-after': null,
    'no-descending-specificity': null
  }
}
