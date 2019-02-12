import React from 'react';

import Layout from '../components/layout'
export default function EventPage({ pageContext, ...props }) {
  console.log(props, pageContext)
  return (
    <Layout pageProps={props}>
      Test
      {/* <h2>{event.summary}</h2>

      <div 
        dangerouslySetInnerHTML={{__html: event.description }}
      /> */}
    </Layout>
  )
}

