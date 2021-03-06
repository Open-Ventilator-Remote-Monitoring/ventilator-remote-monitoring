class Api::V1::VentilatorsController < ApiController

  @@serialize_options = {
    # 'clusters.ventilators' in the array below should also force the inclusion of cluster.
    # But, just in case that changes
    # https://github.com/Netflix/fast_jsonapi/issues/276

    :include => [:clusters, 'clusters.ventilators']
  }

  def index
    if current_user.organization.present?
      org = Organization.includes(:clusters, :ventilators).find(current_user.organization.id)
      render json: OrganizationSerializer.new(org, @@serialize_options)
      return
    end

    render :json => {"error" => "User is not associated with an Organization."}, status: 500
  end
end

