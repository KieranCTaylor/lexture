import Course from '../models/Course'
import Caption from '../models/Caption'
import Video from '../models/Video'

export const searchTranscripts = async query => {
  const res = await Caption.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .exec()

  const videoDetailsFetched = res.map(async r => {
    const vid = await fetchVideoDetails(r.videoId)

    return {
      videoId: vid.videoId,
      videoTitle: vid.title,
      textMention: r.text,
      startTimestamp: r.startTimestamp,
      endTimestamp: r.endTimestamp,
    }
  })

  return await Promise.all(videoDetailsFetched)
}

export const fetchVideoDetails = videoId => {
  console.log(`Looking for ${videoId}`)
  return Video.findOne({ videoId: videoId }).exec()
}