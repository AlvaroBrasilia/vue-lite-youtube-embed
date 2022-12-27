// This is an exact copy of react-lite-youtube-embed ported to Vue.
// https://github.com/ibrahimcesar/react-lite-youtube-embed
import type { PropType } from 'vue-demi'
import { defineComponent } from 'vue-demi'
import h from './utils'
import './main.css'

const linkPreconnect = (href: string) => h('link', { rel: 'preconnect', href })

type imgResolution =
  | 'default'
  | 'mqdefault'
  | 'hqdefault'
  | 'sddefault'
  | 'maxresdefault'

export default defineComponent({
  props: {
    announce: {
      type: String,
      required: false,
      default: 'Watch',
    },
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    activatedClass: {
      type: String,
      required: false,
      default: 'lyt-activated',
    },
    adNetwork: {
      type: Boolean,
      required: false,
      default: true,
    },
    iframeClass: {
      type: String,
      required: false,
      default: '',
    },
    cookie: {
      type: Boolean,
      required: false,
      default: false,
    },
    params: {
      type: String,
      required: false,
      default: '',
    },
    playerClass: {
      type: String,
      required: false,
      default: 'lty-playbtn',
    },
    playlist: {
      type: Boolean,
      required: false,
      default: false,
    },
    playlistCoverId: {
      type: String,
      required: false,
      default: '',
    },
    poster: {
      type: String as PropType<imgResolution>,
      required: false,
      default: 'hqdefault',
    },
    wrapperClass: {
      type: String,
      required: false,
      default: 'yt-lite',
    },
    muted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['iframeAdded'],
  data: () => ({
    preconnected: false,
    iframe: false,
  }),
  computed: {
    videoId() {
      return encodeURIComponent(this.id)
    },
    posterUrl() {
      const videoPlaylisCoverId
        = typeof this.playlistCoverId === 'string'
          ? encodeURIComponent(this.playlistCoverId)
          : null
      return !this.playlist
        ? `https://i.ytimg.com/vi/${this.videoId}/${this.poster}.jpg`
        : `https://i.ytimg.com/vi/${videoPlaylisCoverId}/${this.poster}.jpg`
    },
    ytUrl() {
      return this.cookie
        ? 'https://www.youtube.com'
        : 'https://www.youtube-nocookie.com'
    },
    mutedImp() {
      return this.muted ? '&mute=1' : ''
    },
    iframeSrc() {
      return !this.playlist
        ? `${this.ytUrl}/embed/${this.videoId}?autoplay=1&state=1${this.mutedImp}&${this.params}`
        : `${this.ytUrl}/embed/videoseries?autoplay=1&list=${this.videoId}${this.mutedImp}&${this.params}`
    },
  },
  methods: {
    warmConnections() {
      if (this.preconnected)
        return
      this.preconnected = true
    },
    addIframe() {
      if (this.iframe)
        return
      this.$emit('iframeAdded')
      this.iframe = true
    },
  },
  render() {
    return [
      h('link', {
        rel: 'preload',
        href: this.posterUrl,
        as: 'image',
      }),
      this.preconnected ? linkPreconnect(this.ytUrl) : null,
      this.preconnected ? linkPreconnect('https://www.google.com') : null,
      this.adNetwork ? linkPreconnect('https://static.doubleclick.net') : null,
      this.adNetwork
        ? linkPreconnect('https://googleads.g.doubleclick.net')
        : null,
      h(
        'div',
        {
          'on': {
            pointerover: this.warmConnections,
            click: this.addIframe,
          },
          'class': `${this.wrapperClass} ${this.iframe && this.activatedClass}`,
          'data-title': this.title,
          'style': {
            backgroundImage: `url(${this.posterUrl})`,
          },
          'tabIndex': 0,
        },
        [
          // Play button
          h('button', {
            class: this.playerClass,
            ariaLabel: `${this.announce} ${this.title}`,
          }),
          // Iframe
          this.iframe
            ? h('iframe', {
              class: this.iframeClass,
              title: this.title,
              width: 560,
              height: 315,
              frameborder: 0,
              allow:
                  'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
              allowfullscreen: true,
              src: this.iframeSrc,
            })
            : null,
        ],
      ),
    ]
  },
})
