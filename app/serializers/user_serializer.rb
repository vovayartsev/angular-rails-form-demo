class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :updated_at
end
