require "application_system_test_case"

class VentilatorsTest < ApplicationSystemTestCase
  setup do
    @ventilator = ventilators(:one)
  end

  test "visiting the index" do
    visit ventilators_url
    assert_selector "h1", text: "Ventilators"
  end

  test "creating a Ventilator" do
    visit ventilators_url
    click_on "New Ventilator"

    fill_in "Api key", with: @ventilator.api_key
    fill_in "Cluster", with: @ventilator.cluster_id
    fill_in "Hostname", with: @ventilator.hostname
    fill_in "Name", with: @ventilator.name
    fill_in "Notes", with: @ventilator.notes
    fill_in "Serial number", with: @ventilator.serial_number
    fill_in "Ventilator password", with: @ventilator.ventilator_password
    fill_in "Ventilator user", with: @ventilator.ventilator_user
    click_on "Create Ventilator"

    assert_text "Ventilator was successfully created"
    click_on "Back"
  end

  test "updating a Ventilator" do
    visit ventilators_url
    click_on "Edit", match: :first

    fill_in "Api key", with: @ventilator.api_key
    fill_in "Cluster", with: @ventilator.cluster_id
    fill_in "Hostname", with: @ventilator.hostname
    fill_in "Name", with: @ventilator.name
    fill_in "Notes", with: @ventilator.notes
    fill_in "Serial number", with: @ventilator.serial_number
    fill_in "Ventilator password", with: @ventilator.ventilator_password
    fill_in "Ventilator user", with: @ventilator.ventilator_user
    click_on "Update Ventilator"

    assert_text "Ventilator was successfully updated"
    click_on "Back"
  end

  test "destroying a Ventilator" do
    visit ventilators_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Ventilator was successfully destroyed"
  end
end
