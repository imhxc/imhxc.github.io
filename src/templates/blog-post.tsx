import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout.tsx"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';
import Bio from "../components/Bio";


export default function BlogPost(props) {
  console.log('data: ', props)
  const { data, location } = props
  const post = data.mdx
  return (
    <Layout location={location} title={"Isaac's Blog"}>
      <main>
        <article>
          <header>
            <h1 style={{ color: 'var(--textTitle)' }}>
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
                marginTop: rhythm(-4 / 5),
              }}
            >
              {formatPostDate(post.frontmatter.date)}
              {` • ${formatReadingTime(post.timeToRead)}`}
            </p>
            {/* {translations.length > 0 && (
              <Translations
                translations={translations}
                editUrl={editUrl}
                languageLink={languageLink}
                lang={lang}
              />
            )} */}
          </header>
          <MDXRenderer>{post.body}</MDXRenderer>
        </article>
      </main>
      <aside>
        <Bio />
      </aside>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
      }
    }
  }
`