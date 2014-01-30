# USAGE
# = angular_form_for User.new, name: "userForm" do |f|
#   = f.label :email
#   = f.text_field :email

module Ng
  module Rails
    module Form
      class AngularFormBuilder < ActionView::Helpers::FormBuilder

        [:text_field, :password_field, :text_area, :search_field,
         :telephone_field, :phone_field, :url_field, :email_field, :number_field].each do |method_to_define|
          define_method method_to_define do |field, options = {}|
            add_angular_options(options, field)
            @template.send(
                "#{method_to_define}_tag",
                field, # name
                nil, # value
                options)
          end
        end

        def check_box(field, options = {})
          options = options.merge('type' => 'checkbox')
          add_angular_options(options, field)
          @template.tag :input, options
        end

        private

        def angular_model
          @options["rails-form-for"]
        end

        def add_angular_options(options, field)
          options["ng-model"] ||= "#{angular_model}.#{field}"
          options[:id]        ||= "#{@object_name}_#{field}"
        end
      end
    end
  end
end


