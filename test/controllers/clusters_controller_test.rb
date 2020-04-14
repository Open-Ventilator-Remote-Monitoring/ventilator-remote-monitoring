require 'test_helper'

class ClustersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cluster = clusters(:one)
  end

  test "should get index" do
    get clusters_url
    assert_response :success
  end

  test "should get new" do
    get new_cluster_url
    assert_response :success
  end

  test "should create cluster" do
    assert_difference('Cluster.count') do
      post clusters_url, params: { cluster: { description: @cluster.description, name: @cluster.name, organization_id: @cluster.organization_id } }
    end

    assert_redirected_to cluster_url(Cluster.last)
  end

  test "should show cluster" do
    get cluster_url(@cluster)
    assert_response :success
  end

  test "should get edit" do
    get edit_cluster_url(@cluster)
    assert_response :success
  end

  test "should update cluster" do
    patch cluster_url(@cluster), params: { cluster: { description: @cluster.description, name: @cluster.name, organization_id: @cluster.organization_id } }
    assert_redirected_to cluster_url(@cluster)
  end

  test "should destroy cluster" do
    assert_difference('Cluster.count', -1) do
      delete cluster_url(@cluster)
    end

    assert_redirected_to clusters_url
  end
end
