class StaticPagesController < ApplicationController
	skip_before_action :authenticate_user!

	def index
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
