class VentilatorsController < ApplicationController
  before_action :set_ventilator, only: [:show, :edit, :update, :destroy]

  # GET /ventilators
  # GET /ventilators.json
  def index
    @ventilators = Ventilator.all
  end

  # GET /ventilators/1
  # GET /ventilators/1.json
  def show
  end

  # GET /ventilators/new
  def new
    @ventilator = Ventilator.new
  end

  # GET /ventilators/1/edit
  def edit
  end

  # POST /ventilators
  # POST /ventilators.json
  def create
    @ventilator = Ventilator.new(ventilator_params)

    respond_to do |format|
      if @ventilator.save
        format.html { redirect_to @ventilator, notice: 'Ventilator was successfully created.' }
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
        format.html { redirect_to @ventilator, notice: 'Ventilator was successfully updated.' }
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
    @ventilator.destroy
    respond_to do |format|
      format.html { redirect_to ventilators_url, notice: 'Ventilator was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ventilator
      @ventilator = Ventilator.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def ventilator_params
      params.require(:ventilator).permit(:name, :serial_number, :hostname, :api_key, :notes, :ventilator_user, :ventilator_password, :cluster_id)
    end
end