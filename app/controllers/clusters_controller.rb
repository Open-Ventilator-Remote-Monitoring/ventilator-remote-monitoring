class ClustersController < ApplicationController
  before_action :set_cluster, only: [:show, :edit, :update, :destroy]
  before_action :get_organization

  # GET /clusters
  # GET /clusters.json
  def index
    @clusters = Cluster.all
  end

  # GET /clusters/1
  # GET /clusters/1.json
  def show
  end

  # GET /clusters/new
  def new
    @cluster = Cluster.new
  end

  # GET /clusters/1/edit
  def edit
  end

  # POST /clusters
  # POST /clusters.json
  def create
    @cluster = @organization.clusters.build(cluster_params)

    respond_to do |format|
      if @cluster.save
        format.html { redirect_to organization_path(@organization), notice: 'Cluster was successfully created.' }
        format.json { render :show, status: :created, location: @cluster }
      else
        format.html { render :new }
        format.json { render json: @cluster.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /clusters/1
  # PATCH/PUT /clusters/1.json
  def update
    respond_to do |format|
      if @cluster.update(cluster_params)
        format.html { redirect_to @cluster, notice: 'Cluster was successfully updated.' }
        format.json { render :show, status: :ok, location: @cluster }
      else
        format.html { render :edit }
        format.json { render json: @cluster.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /clusters/1
  # DELETE /clusters/1.json
  def destroy
    @cluster.destroy
    respond_to do |format|
      format.html { redirect_to clusters_url, notice: 'Cluster was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def get_organization
      @organization = Organization.find(params[:organization_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_cluster
      @cluster = Cluster.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def cluster_params
      params.require(:cluster).permit(:name, :description, :organization_id)
    end
end
