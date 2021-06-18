export type UserConfiguration = {
    admin: Boolean
}
  
export type AttributeSpec = {
      id: Number,
      uri: String,
      range : String,
      label: String,
      visible: Boolean,
      negative: Boolean,
      linked: Boolean,
  }