<template>
  <text class="number">{{ displayNumber }}</text>
</template>

<script>
export default {
  name: 'count-up',
  props: {
    endValue: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      displayNumber: 0,
      timer: null
    }
  },
  watch: {
    endValue: {
      handler(newVal) {
        this.startAnimation(newVal)
      },
      immediate: true
    }
  },
  methods: {
    startAnimation(endValue) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      
      const startValue = this.displayNumber
      const startTime = Date.now()
      const frameRate = 1000 / 60 // 60fps
      
      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        
        if (elapsed < this.duration) {
          this.displayNumber = Math.round(this.easeOutQuad(elapsed, startValue, endValue - startValue, this.duration))
          this.timer = setTimeout(animate, frameRate)
        } else {
          this.displayNumber = endValue
        }
      }
      
      this.timer = setTimeout(animate, frameRate)
    },
    easeOutQuad(t, b, c, d) {
      t /= d
      return -c * t * (t - 2) + b
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped>
.number {
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
}
</style>
