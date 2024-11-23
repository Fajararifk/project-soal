export default {
  name: 'questions',
  title: "Questions",
  type: 'document',
  fields: [
    {
      name: 'question',
      title: "Question",
      type: "string"
    },
    {
      name: 'questionImage',
      title: 'Question Image',
      type: 'image',  // Image type field
      options: {
        hotspot: true,  // Optional: allows cropping
      }
    },
    {
      name: 'answers',
      title: "Answers",
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: "correctAnswer",
      title: "Correct Answer",
      type: "string"
    }
  ]
}