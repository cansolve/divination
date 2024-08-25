module.exports = {
  plugins: {
    'postcss-px2vp': {
      viewportWidth(rule) {
        const file = rule.source?.input.file
        if (file?.includes('vant')) return 375
        return 1080
      },
      minPixelValue: 2,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      mediaQuery: true,
      landscape: false,
      landscapeUnit: 'vh',
      landscapeWidth: 1080,
    },
  },
}
