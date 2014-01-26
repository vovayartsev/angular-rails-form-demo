require "ng-rails-form/version"

module Ng
  module Rails
    module Form
      autoload :AngularFormBuilder, "ng-rails-form/angular_form_builder"
      autoload :AngularFormHelper, "ng-rails-form/angular_form_Helper"
      class Engine < ::Rails::Engine
        initializer "setup angular form for rails" do
          ActionView::Base.send(:include, Ng::Rails::Form::AngularFormHelper)
        end
      end
    end
  end
end

