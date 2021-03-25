# from app.models import db, Song
# import os


# directory = r'C:/home/kumo/appaca/Sound_Cloud/app/static/seed_data'


# def search_songs():
#     song_list = []
#     for entry in os.scandir(directory):
#         if (entry.path.endswith(".mp3")) and entry.is_file():
#             song_list.append(entry.path)
#     return song_list


# def seed_songs():
#     songs = search_songs()

#     # for song in songs:
#     #     song = Song()


#     # db.session.commit()


# def undo_songs():
#     db.session.execute('TRUNCATE songs;')
#     db.session.commit()
