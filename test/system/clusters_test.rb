require "application_system_test_case"

class ClustersTest < ApplicationSystemTestCase
  setup do
    @cluster = clusters(:one)
  end

  test "visiting the index" do
    visit clusters_url
    assert_selector "h1", text: "Clusters"
  end

  test "creating a Cluster" do
    visit clusters_url
    click_on "New Cluster"

    fill_in "Description", with: @cluster.description
    fill_in "Name", with: @cluster.name
    fill_in "Organization", with: @cluster.organization_id
    click_on "Create Cluster"

    assert_text "Cluster was successfully created"
    click_on "Back"
  end

  test "updating a Cluster" do
    visit clusters_url
    click_on "Edit", match: :first

    fill_in "Description", with: @cluster.description
    fill_in "Name", with: @cluster.name
    fill_in "Organization", with: @cluster.organization_id
    click_on "Update Cluster"

    assert_text "Cluster was successfully updated"
    click_on "Back"
  end

  test "destroying a Cluster" do
    visit clusters_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Cluster was successfully destroyed"
  end
end
