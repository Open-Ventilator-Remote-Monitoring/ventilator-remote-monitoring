class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  belongs_to :organization, optional: true

  enum role: [:unassigned, :org_admin, :admin]
  after_initialize :set_default_role, :if => :new_record?

  def set_default_role
  	self.role ||= :unassigned
  end

end
