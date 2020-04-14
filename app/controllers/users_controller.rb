class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :require_admin, except: [ :index, :show, :edit ]
  before_action :require_org_admin_has_org, only: [:index, :show, :edit]

  # GET /users
  # GET /users.json
  def index
    if current_user.admin?
      @users = User.all.paginate(:page => params[:page], :per_page => 10)
      @unassigned_users = User.where("organization_id IS NULL").order(created_at: :desc).last(5)
    elsif current_user.org_admin?
        @users = current_user.organization.users.paginate(:page => params[:page], :per_page => 10)
        #@unassigned_users = User.all.where("role = ? AND organization_id = ?", 0, nil)
        @unassigned_users = User.where("organization_id IS NULL").order(created_at: :desc).last(5)
    else
      flash.alert = "You must be an administrator to view other users"
      redirect_to root_url
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    if (current_user.admin? ||
       (current_user.org_admin? && (@user.organization_id == current_user.organization_id)) ||
       current_user == @user)
        # continue
    else
      flash.alert = "You must be an administrator to view other users"
      redirect_to root_url
    end
  end

  # GET /users/1/edit
  def edit
    if current_user.admin?
      @user = User.find(params[:id])
    elsif (current_user.org_admin? &&
            (current_user.organization.users.include?(User.find(params[:id])))) ||
          (current_user.org_admin? && (User.find(params[:id]).organization_id == nil))
      @user = User.find(params[:id])
      @user.organization_id = current_user.organization.id
    else
      flash.alert = "You must be an administrator to edit other users"
      redirect_to root_url
    end

  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    unless current_user.admin?

      # puts "*** Debugging ***"
      # puts "current_user.org_admin?: #{current_user.org_admin?}"
      # puts "current_user.organization.users.include?(User.find(params[:id])): #{current_user.organization.users.include?(User.find(params[:id]))}"
      # puts "User.find(params[:id]).organization_id == nil: #{User.find(params[:id]).organization_id == nil}"
      # puts "((user_params[:role] == org_admin) || (user_params[:role] == student) || (user_params[:role] == unassigned)): #{((user_params[:role] == "org_admin") || (user_params[:role] == "student") || (user_params[:role] == "unassigned"))}"
      # puts "current_user.organization.id == user_params[:organization_id]: #{current_user.organization.id.to_s == user_params[:organization_id]}"
      # puts "current_user.organization.id: #{current_user.organization.id.to_s.class}"
      # puts "user_params[:organization_id]: #{user_params[:organization_id].class}"

      #      I am an org_admin      AND ((The organization includes said user)                              OR (Said user does not belong to an organization)) AND (I am requesting to make the user an org_admin, or unassigned)                    AND (I am a member of the organization to which I am assigning said user)
      unless current_user.org_admin? && (((current_user.organization.users.include?(User.find(params[:id]))) || (User.find(params[:id]).organization_id == nil)) && ((user_params[:role] == "org_admin") || (user_params[:role] == "unassigned")) && (current_user.organization.id.to_s == user_params[:organization_id]))
        flash.alert = "You must be an administrator to perform those updates on that user "
        redirect_to root_url and return
      end
    end
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email, :encrypted_password, :reset_password_token, :name, :bio, :sign_in_count, :current_sign_in_ip, :last_sign_in_ip, :role, :reset_password_sent_at, :remember_created_at, :current_sign_in_at, :last_sign_in_at, :organization_id)
    end

    def require_admin
      unless current_user.admin?
        flash.alert = "You must be an administrator to access this section"
        redirect_to root_url
      end
    end

    def require_org_admin_has_org
      if current_user.org_admin? && current_user.organization == nil
        flash.alert = "Please ask an Administrator to assign you to an Organization"
        redirect_to root_url
      end
    end

end


