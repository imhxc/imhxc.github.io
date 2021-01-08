import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout.tsx"
import Image from "../components/image"
import get from 'lodash/get';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import SEO from "../components/seo"
import { rhythm } from '../utils/typography';
import Bio from "../components/Bio";
import Footer from "../components/Footer";

const IndexPage = (props) => {
  const { data, location } = props
  const { allMdx: {
    edges,
    totalCount
  } } = data
  return (
    <Layout location={location} title={"Isaac's Blog"}>
      <aside>
        <Bio />
      </aside>
      
      <main>
        {edges.map(({ node }) => {
          const { frontmatter } = node
          const { slug, date, spoiler, title } = frontmatter
  
          return (
            <article key={node.id}>
              <header>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: rhythm(1),
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link
                    style={{ boxShadow: 'none' }}
                    to={slug}
                    rel="bookmark"
                  >
                    {title}
                  </Link>
                </h3>
                <small>
                  {formatPostDate(date, 'en')}
                  {` • ${formatReadingTime(node.timeToRead)}`}
                </small>
              </header>
              <p
                dangerouslySetInnerHTML={{ __html: spoiler }}
              />
            </article>
          );
        })}
      </main>

      <Footer />
    </Layout>
  )
}

export default IndexPage


export const query = graphql`
  query {
    allMdx {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            slug
            spoiler
          }
          timeToRead
          excerpt
        }
      }
    }
  }
`