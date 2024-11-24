const supabase = require("../config/supabase");
const retry = require("async-retry");
const { objectToCamel } = require("ts-case-convert");

class Snapshot {
  static async create(universityId, url, dataArray) {
    const snapshots = [];

    for (const data of dataArray) {
      const { path, html, courseId } = data;

      const snapshot = await retry(
        async () => {
          const { data: snapshotData, error } = await supabase
            .from("snapshots")
            .insert({
              university_id: universityId,
              path,
              html,
              course_id: courseId,
            })
            .select();

          if (error) throw error;
          return snapshotData[0];
        },
        {
          retries: 3, // 3회 재시도
          minTimeout: 1000,
        }
      );

      snapshots.push(snapshot);
    }

    return snapshots;
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
    return data.map(objectToCamel);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("snapshots")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return objectToCamel(data);
  }
}

module.exports = Snapshot;
