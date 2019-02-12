import React from 'react'

import Layout from '../components/layout'
export default function EventPage({ pageContext, ...props }) {
  console.log('props', props)
  console.log('pageContext', pageContext)
  return (
    <Layout pageProps={props}>
      {Object.keys(pageContext).length > 0 ? (
        <>
          <h2>{pageContext.event.summary}</h2>

          <div dangerouslySetInnerHTML={{ __html: pageContext.event.description }} />
        </>
      ) : (
        <p>No Info For this Event</p>
      )}
    </Layout>
  )
}
