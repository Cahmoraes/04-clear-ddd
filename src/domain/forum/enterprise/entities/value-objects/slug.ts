export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalize it as a slug
   *
   * Example: "An exemple title" => "an-exemple-title"
   * @param text {string} */
  static createFromText(aText: string) {
    const slugText = aText
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
