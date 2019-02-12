import React from 'react';

import Layout from '../components/layout'
export default function EventPage(props) {
  console.log(props)
  return (
    <Layout pageProps={props.pageContext}>
      Test
      {/* <h2>{event.summary}</h2>

      <div 
        dangerouslySetInnerHTML={{__html: event.description }}
      /> */}
    </Layout>
  )
}

