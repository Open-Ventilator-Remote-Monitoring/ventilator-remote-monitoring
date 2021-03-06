class VentilatorsController < ApplicationController
  before_action :require_admin_or_org_admin, except: [:index, :show]
  before_action :set_ventilator, only: [:show, :edit, :update, :destroy]

  # GET /ventilators
  # GET /ventilators.json
  def index
    if current_user.organization.present?
      @ventilators = current_user.organization.ventilators.order("clusters.name, name")
    else
      @ventilators = nil
    end
  end

  # GET /ventilators/1
  # GET /ventilators/1.json
  def show

  end

  # GET /ventilators/new
  def new
    @ventilator = Ventilator.new

    # If coming from a cluster list, we set the cluster_id where the ventilator will be added.
    # We also show an Organization breadcrumb at the top. When we don't come from a cluster,
    # we just set it to the user's organization

    if(params[:cluster_id])
      req_cluster_id = params[:cluster_id].to_i
      if current_user.admin? || (current_user.organization.clusters.any?{ |cluster| cluster.id == req_cluster_id })
        @ventilator.cluster_id = req_cluster_id
        @organization = @ventilator.cluster.organization
      else
        flash.alert = "You do not have permission to add a Ventilator to that cluster"
        redirect_to clusters_url
      end
    else
      redirect_to clusters_url
    end
  end

  # GET /ventilators/1/edit
  def edit
  end

  # POST /ventilators
  # POST /ventilators.json
  def create
    @ventilator = Ventilator.new(ventilator_params)

    # non-admin users are only allowed to create ventilators in any cluster in their own organization
    if current_user.org_admin?
      if current_user.organization.clusters.any?{ |cluster| cluster.id == @ventilator.cluster_id }
        # ventilator was added to a cluster within user's org
      else
        flash.alert = "You do not have permission to add a Ventilator to this cluster"
        redirect_to ventilator_url
      end
    end

    respond_to do |format|
      if @ventilator.save
        format.html { redirect_to cluster_path(@ventilator.cluster_id), notice: 'Ventilator was successfully created.' }
        format.json { render :show, status: :created, location: @ventilator }
      else
        format.html { render :new }
        format.json { render json: @ventilator.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ventilators/1
  # PATCH/PUT /ventilators/1.json
  def update
    respond_to do |format|
      if @ventilator.update(ventilator_params)
        format.html { redirect_to cluster_path(@ventilator.cluster_id), notice: 'Ventilator was successfully updated.' }
        format.json { render :show, status: :ok, location: @ventilator }
      else
        format.html { render :edit }
        format.json { render json: @ventilator.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ventilators/1
  # DELETE /ventilators/1.json
  def destroy
    cluster = @ventilator.cluster
    @ventilator.destroy
    respond_to do |format|
      format.html { redirect_to cluster_path cluster, notice: 'Ventilator was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ventilator
      if current_user.admin? ||
         (current_user.organization.present? &&
           (current_user.organization.ventilators.include? Ventilator.find(params[:id])))
        @ventilator = Ventilator.find(params[:id])
        @organization = @ventilator.cluster.organization
      else
        flash.alert = "You do not have permission to view this ventilator"
        redirect_to ventilators_url
      end
    end

    # Only allow a list of trusted parameters through.
    def ventilator_params
      params.require(:ventilator).permit(:name, :serial_number, :hostname, :api_key, :notes, :ventilator_user, :ventilator_password, :cluster_id)
    end
end
