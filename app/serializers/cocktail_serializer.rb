class CocktailSerializer < ActiveModel::Serializer
  attributes :id, :name, :instructions, :category, :glass, :image

  has_many :ingredients
end
