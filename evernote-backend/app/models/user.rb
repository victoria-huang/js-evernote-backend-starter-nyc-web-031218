class User < ApplicationRecord
  has_many :notes
  validates :name, uniqueness: true
end
