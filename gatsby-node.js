const { google } = require('googleapis')
const path = require('path')

function authenticate() {
  const privateKey = process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n');
  const jwtClient = new google.auth.JWT(
    process.env.GC_CLIENT_EMAIL,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/calendar']
  )

  return new Promise(res => {
    jwtClient.authorize(err => {
      if (err) {
        throw new Error(err)
      }
      res(jwtClient)
    })
  })
}

function getEvents(auth) {
  return new Promise(async (resolve, reject) => {
    const calender = google.calendar('v3')

    calender.events
      .list({
        auth,
        calendarId: process.env.GC_ID,
      })
      .then(response => {
        if (response.err) {
          reject(response.err)
        }

        resolve(response.data)
      })
      .catch(err => console.log('the error', err))
  })
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  const jwtClient = await authenticate()
  const data = await getEvents(jwtClient)

  data.items.forEach(event => {
    console.log(event.attachments)
    const nodeMeta = {
      id: createNodeId(`my-data-${event.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'CalendarEvent',
        content: JSON.stringify(event),
        contentDigest: createContentDigest(event),
      },
    }

    const node = Object.assign({}, event, nodeMeta)
    createNode(node)
  })

  return
}

// exports.onCreateNode = ({ node }) => {
//   if (node.internal.type === 'CalendarEvent') {
//     console.log('the vent')
//   }
// }

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const template = path.resolve('src/pages/event.js')
    resolve(
      graphql(`
        query CALENDAR_EVENTS {
          allCalendarEvent {
            edges {
              node {
                id
                summary
                description
                location
                end {
                  # date(formatString: "M/DD/YYYY h:mm:ss z")
                  dateTime(formatString: "M/DD/YYYY h:mm:ss z")
                }
                start {
                  # date(formatString: "M/DD/YYYY h:mm:ss z")
                  dateTime(formatString: "M/DD/YYYY h:mm:ss z")
                }
              }
            }
          }
        }
      `).then(results => {
        if (results.errors) {
          reject('the error', results.errors)
        }

        results.data.allCalendarEvent.edges.map(({ node }) => {
          // console.log(node);
          createPage({
            path: `/event/${node.id}`,
            component: template,
            context: { event: node },
          })
        })
      })
    )
  })
}
