import theme from "@nuxt/content-theme-docs";

export default theme({
  docs: {
    primaryColor: '#79eea6'
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
