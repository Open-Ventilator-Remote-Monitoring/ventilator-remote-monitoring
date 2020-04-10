class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :require_admin, except: [ :index, :show ]

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
      flash[:error] = "You must be an administrator to view other users"
      redirect_to root_url      
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    if (current_user.admin? || (current_user.org_admin? && (User.find(params[:id]).organization_id == current_user.organization_id)) || current_user == User.find(params[:id]))
      @user = User.find(params[:id])
    else
      flash[:error] = "You must be an administrator to view other users"
      redirect_to root_url
    end

  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
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
        flash[:error] = "You must be an administrator to access this section"
        redirect_to root_url
      end
    end

end
