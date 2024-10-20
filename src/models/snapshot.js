const supabase = require("../config/supabase");

class Snapshot {
  static async create(universityId, url, path, html, courseId) {
    const { data, error } = await supabase
      .from("snapshots")
      .insert({
        university_id: universityId,
        url,
        path,
        html,
        course_id: courseId,
      })
      .select();

    if (error) throw error;
    return data[0];
  }

  static async findAll(universityId, path, courseId) {
    let query = supabase
      .from("snapshots")
      .select("*")
      .eq("university_id", universityId);

    if (path) query = query.eq("path", path);
    if (courseId) query = query.eq("course_id", courseId);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("snapshots")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Snapshot;
