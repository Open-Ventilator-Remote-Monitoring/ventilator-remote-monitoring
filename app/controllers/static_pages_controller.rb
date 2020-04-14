class StaticPagesController < ApplicationController
	skip_before_action :authenticate_user!

	def index
		if (current_user.present? && (! current_user.admin? && current_user.organization == nil))
      flash.alert = "Please ask an Administrator to assign you to an Organization"
		end

		if signed_in?
			render 'index_signed_in'
		else
			render 'index_no_signin'
		end
	end

	def about
	end

	def contribute
	end

end
