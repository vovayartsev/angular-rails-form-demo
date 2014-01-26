# USAGE
# = angular_form_for User.new, name: "userForm" do |f|
#   = f.label :email
#   = f.text_field :email

module Ng
  module Rails
    module Form
      class AngularFormBuilder < ActionView::Helpers::FormBuilder
        def angular_model
          @options["rails-form-for"]
        end

        def text_field(method, options = {})
          options["ng-model"] ||= "#{angular_model}.#{method}"
          options[:id] ||= "#{@object_name}_#{method}"

          @template.send(
              "text_field_tag",
              method, # name
              nil, # value
              options)
        end
      end
    end
  end
end


