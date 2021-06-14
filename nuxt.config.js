import theme from "@nuxt/content-theme-docs";

export default theme({
  docs: {
    primaryColor: '#79eea6'
  },
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css' }
    ],
    script: [
      {
        src: "/__/firebase/8.6.7/firebase-app.js",
        body: true,
      },
      {
        src: "/__/firebase/8.6.7/firebase-analytics.jss",
        body: true,
      },
      {
        src: "/__/firebase/init.js",
        body: true,
      },
    ]
  },
  content: {
    markdown: {
      remarkPlugins: [
        'remark-math'
      ],
      rehypePlugins: [
        ['rehype-katex', { output: 'html' }]
      ]
    }
  }
})
