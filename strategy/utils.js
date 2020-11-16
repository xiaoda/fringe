const utils = {
  capitalize (string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`
  },
  percentize (number) {
    return `${Math.round(number * 100)}%`
  }
}
