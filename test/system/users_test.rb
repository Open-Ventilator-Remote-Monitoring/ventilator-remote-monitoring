require "application_system_test_case"

class UsersTest < ApplicationSystemTestCase
  setup do
    @user = users(:one)
  end

  test "visiting the index" do
    visit users_url
    assert_selector "h1", text: "Users"
  end

  test "creating a User" do
    visit users_url
    click_on "New User"

    fill_in "Bio", with: @user.bio
    fill_in "Current sign in at", with: @user.current_sign_in_at
    fill_in "Current sign in ip", with: @user.current_sign_in_ip
    fill_in "Email", with: @user.email
    fill_in "Encrypted password", with: @user.encrypted_password
    fill_in "Last sign in at", with: @user.last_sign_in_at
    fill_in "Last sign in ip", with: @user.last_sign_in_ip
    fill_in "Name", with: @user.name
    fill_in "Organization", with: @user.organization_id
    fill_in "Remember created at", with: @user.remember_created_at
    fill_in "Reset password sent at", with: @user.reset_password_sent_at
    fill_in "Reset password token", with: @user.reset_password_token
    fill_in "Role", with: @user.role
    fill_in "Sign in count", with: @user.sign_in_count
    click_on "Create User"

    assert_text "User was successfully created"
    click_on "Back"
  end

  test "updating a User" do
    visit users_url
    click_on "Edit", match: :first

    fill_in "Bio", with: @user.bio
    fill_in "Current sign in at", with: @user.current_sign_in_at
    fill_in "Current sign in ip", with: @user.current_sign_in_ip
    fill_in "Email", with: @user.email
    fill_in "Encrypted password", with: @user.encrypted_password
    fill_in "Last sign in at", with: @user.last_sign_in_at
    fill_in "Last sign in ip", with: @user.last_sign_in_ip
    fill_in "Name", with: @user.name
    fill_in "Organization", with: @user.organization_id
    fill_in "Remember created at", with: @user.remember_created_at
    fill_in "Reset password sent at", with: @user.reset_password_sent_at
    fill_in "Reset password token", with: @user.reset_password_token
    fill_in "Role", with: @user.role
    fill_in "Sign in count", with: @user.sign_in_count
    click_on "Update User"

    assert_text "User was successfully updated"
    click_on "Back"
  end

  test "destroying a User" do
    visit users_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "User was successfully destroyed"
  end
end
