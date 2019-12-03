import express from 'express'
const router = express.Router()
import Video from '../models/Video'
import { fetchCourseFromVideoId } from './search'

router.get('/', async (req, res) => {
  const videoId = req.query.videoid
  const vid = await Video.findOne({ videoId: videoId })

  if (!vid) {
    res.status(404).send('VideoId not found!')
    return false
  }

  const course = await fetchCourseFromVideoId(vid.videoId)

  const tags = vid.topics.map(x => ({ tag: x }))

  const languages = vid.captions.map(x => ({ language: x.language }))

  const data = {
    course: course.title,
    title: vid.title,
    videoUrl: vid.url,
    lecturer: course.instructor,
    tags: tags,
    languages: languages,
  }

  // todo render transcript text by fetching from mongo

  res.render('video.html', data)
})

export default router
