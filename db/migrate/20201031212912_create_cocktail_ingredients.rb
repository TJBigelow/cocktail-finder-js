class CreateCocktailIngredients < ActiveRecord::Migration[6.0]
  def change
    create_table :cocktail_ingredients do |t|
      t.string :measure
      t.references :cocktail, null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true

      t.timestamps
    end
  end
end
