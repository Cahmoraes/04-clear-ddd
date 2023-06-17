import { Slug } from './slug'

test('it should be abe to create a new slug from text', () => {
  const slug = Slug.createFromText('Example question title')
  expect(slug.value).toBe('example-question-title')
})
