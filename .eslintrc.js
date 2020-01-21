module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' && !process.env.ATOM_HOME ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' && !process.env.ATOM_HOME ? 'error' : 'off',
    'no-multiple-empty-lines': [
      'error', {
        'max': 2,
        'maxEOF': 1
      }
    ],
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': [
      'error',
      'never'
    ],
    'semi': [
      'error',
      'never'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'no-trailing-spaces': [
      'error', {
        'skipBlankLines': true
      }
    ],
    'vue/max-attributes-per-line': ['error', {
      'singleline': 3
    }],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case'
    ],
    'object-shorthand': [
      'error',
      'always'
    ],
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attributes-order': ['error', {
      'order': [
        'LIST_RENDERING',
        'DEFINITION',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT'
      ]
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
