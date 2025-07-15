function Lecture({ params }: { params: { slug: string; lectureId: string } }) {
  const { slug, lectureId } = params
  console.log({ slug, lectureId })
  return <div>Lecture Page</div>
}

export default Lecture
