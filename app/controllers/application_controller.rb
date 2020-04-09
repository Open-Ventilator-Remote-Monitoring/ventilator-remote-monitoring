class ApplicationController < ActionController::Base
  def current_user
    #return unless session[:user_id]
    #@current_user ||= User.find(session[:user_id])
    @current_user = @current_user.find(1)
  end
end
