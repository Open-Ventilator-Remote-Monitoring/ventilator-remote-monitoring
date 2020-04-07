class Api::V1::VentilatorsController < ApplicationController
  def index
    vs = Ventilator.all.order(name: :asc)
    render json: vs
  end

  def create
    ventilator = Ventilator.create!(ventilator_params)
    if ventilator
      render json: ventilator
    else
      render json: ventilator.errors
    end
  end

  def show
    if ventilator
      render json: ventilator
    else
      render json: ventilator.errors
    end
  end

  def destroy
    ventilator&.destroy
    render json: { message: 'Ventilator deleted!' }
  end

  private

  def ventilator_params
    params.permit(:name)
  end

  def ventilator
    @ventilator ||= Ventilator.find(params[:id])
  end
end
