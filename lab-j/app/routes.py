from flask import request,jsonify

@app.route('/movies',methods=['POST'])
def create_movie():
    data = request.get_json()
    new_movie=Movie(title=data['title'],director=data['year'])
    db.session.add(new_movie)
    db.session.commit()
    return jsonify(new_movie.serialize())





