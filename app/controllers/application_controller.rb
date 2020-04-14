class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!

  private

  def require_admin
    unless current_user.admin?
      flash.alert = "You must be an administrator to access this section"
      redirect_to root_url
    end
  end

  def require_admin_or_org_admin
    unless current_user.admin? || current_user.org_admin?
      flash.alert = "You must be an administrator to access this section"
      redirect_to root_url
    end
  end

end
