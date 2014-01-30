module Ng
  module Rails
    module Form
      module AngularFormHelper
        def angular_form_for(rails_model, options, &block)
          on_success = options.delete(:on_success)
          on_error   = options.delete(:on_error)
          ng_model   = options[:as] # we really don't delete it
          name       = options.delete(:name)
          raise ArgumentError, "Missing block" unless block_given?
          raise ArgumentError, "required option missed:  :as => 'ng-model name'" unless ng_model
          raise ArgumentError, "required option missed:  :name => 'angular form name'" unless name

          options[:builder] = Ng::Rails::Form::AngularFormBuilder

          html_options                   = options[:html] ||= {}
          html_options["name"]           = name
          html_options["rails-form-for"] = ng_model
          options["rails-form-for"]      = ng_model
          html_options["on-success"]     = on_success if on_success
          html_options["on-error"]       = on_error if on_error

          builder = instantiate_builder(ng_model, rails_model, options)
          output  = capture(builder, &block)
          content_tag :form, output, html_options
        end
      end
    end
  end
end