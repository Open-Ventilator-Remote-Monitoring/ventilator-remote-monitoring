require 'test_helper'

class VentilatorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @ventilator = ventilators(:one)
  end

  test "should get index" do
    get ventilators_url
    assert_response :success
  end

  test "should get new" do
    get new_ventilator_url
    assert_response :success
  end

  test "should create ventilator" do
    assert_difference('Ventilator.count') do
      post ventilators_url, params: { ventilator: { api_key: @ventilator.api_key, cluster_id: @ventilator.cluster_id, hostname: @ventilator.hostname, name: @ventilator.name, notes: @ventilator.notes, serial_number: @ventilator.serial_number, ventilator_password: @ventilator.ventilator_password, ventilator_user: @ventilator.ventilator_user } }
    end

    assert_redirected_to ventilator_url(Ventilator.last)
  end

  test "should show ventilator" do
    get ventilator_url(@ventilator)
    assert_response :success
  end

  test "should get edit" do
    get edit_ventilator_url(@ventilator)
    assert_response :success
  end

  test "should update ventilator" do
    patch ventilator_url(@ventilator), params: { ventilator: { api_key: @ventilator.api_key, cluster_id: @ventilator.cluster_id, hostname: @ventilator.hostname, name: @ventilator.name, notes: @ventilator.notes, serial_number: @ventilator.serial_number, ventilator_password: @ventilator.ventilator_password, ventilator_user: @ventilator.ventilator_user } }
    assert_redirected_to ventilator_url(@ventilator)
  end

  test "should destroy ventilator" do
    assert_difference('Ventilator.count', -1) do
      delete ventilator_url(@ventilator)
    end

    assert_redirected_to ventilators_url
  end
end
