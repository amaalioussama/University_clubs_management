<?php 

namespace App\Controllers;

use App\Models\ClubModel;
use CodeIgniter\HTTP\IncomingRequest;
use App\Models\EventModel;

use App\Models\UserModel;
use App\Models\ClubMembershipModel;

class EventController extends BaseController
{
    public function index()
    {
        // return view();
    }

    public function allEvents()
    {
        $eventModel = new EventModel();
        $events = $eventModel->findAll();
        return $this->response->setJSON($events);
    }

    public function getEvent($id){
        $eventModel = new EventModel();
        $event = $eventModel->find($id);
        return $this->response->setJSON($event);
    }

    public function addevent()
    {
        $event = new EventModel();
        $validation = \Config\Services::validation();

        $validation->setRules([
            'id_club' => 'required|integer',
            'name' => 'required|string|max_length[255]',
            'description' => 'required|string',
            'location' => 'required|string|max_length[255]',
            'picture' => 'uploaded[picture]|max_size[picture,1024]|ext_in[picture,png,jpg,jpeg,avif,webp]',
            'date' => 'required|valid_date'
        ]);

        if (!$validation->withRequest($this->request)->run()) {
            return $this->response->setJSON(['status' => 'error', 'message' => $validation->getErrors()]);
        }

        $picture = $this->request->getFile('picture');
        if ($picture->isValid() && !$picture->hasMoved()) {
            $picture->move(FCPATH . 'uploads/events/');
            $picturePath = $picture->getName();
        } else {
            return $this->response->setJSON(['status' => 'error', 'message' => 'Failed to upload picture']);
        }

        $data = [
            'id_club' => $this->request->getVar('id_club'),
            'name' => $this->request->getVar('name'),
            'description' => $this->request->getVar('description'),
            'location' => $this->request->getVar('location'),
            'picture' => $picturePath,
            'date' => $this->request->getVar('date'),
            'created_at' => date('Y-m-d H:i:s')
        ];

        if ($event->insert($data)) {
            return $this->response->setJSON(['status' => 'success', 'message' => 'Event added successfully']);
        } else {
            return $this->response->setJSON(['status' => 'error', 'message' => 'Failed to add event']);
        }
    }

    public function updateEvent($id)
    {
        $validation = \Config\Services::validation();

        $validation->setRules([
            'id_club' => 'permit_empty|integer|max_length[255]',
            'name' => 'permit_empty|string|max_length[255]',
            'description' => 'permit_empty|string|max_length[255]',
            'picture' => 'permit_empty|uploaded[picture]|max_size[picture,1024]|ext_in[picture,png,jpg,jpeg,avif,webp]',
            'location' => 'permit_empty|string|min_length[2]',
            'date' => 'permit_empty|valid_date',
        ]);

        if (!$validation->withRequest($this->request)->run()) {
            return $this->response->setJSON(['status' => 'error', 'message' => $validation->getErrors()]);
        }

        $eventModel = new EventModel();

        $event = $eventModel->find($id);
        if (!$event) {
            return $this->response->setJSON(['status' => 'error', 'message' => 'Event not found']);
        }

        $data = [];
        $fields = ['id_club', 'name', 'description', 'location', 'date'];
        foreach ($fields as $field) {
            $value = $this->request->getVar($field);
            if (!is_null($value)) {
                $data[$field] = $value;
            }
        }

        $picture = $this->request->getFile('picture');
        if ($picture && $picture->isValid() && !$picture->hasMoved()) {
            $picture->move(FCPATH . 'uploads/events/');
            $data['picture'] = $picture->getName();
        }

       
        if (!empty($data) && $eventModel->update($id, $data)) {
            return $this->response->setJSON(['status' => 'success', 'message' => 'Event updated successfully']);
        }

        return $this->response->setJSON(['status' => 'error', 'message' => 'No changes made or update failed']);
    }

    public function deleteEvent($id)
    {
        $event = new EventModel();
        if ($event->delete($id)) {
            return $this->response->setJSON(['status' => 'success', 'message' => 'Event deleted successfully']);
        } else {
            return $this->response->setJSON(['status' => 'error', 'message' => 'Failed to delete event']);
        }
    }

  
    
    public function getClubEvents($id)
    {
        $clubModel = new ClubModel();
        $eventModel = new EventModel();
    
        // Check if the club exists
        $club = $clubModel->find($id);
        if (!$club) {
            log_message('error', 'Club not found: ' . $id);
            return $this->response->setJSON(['status' => 'error', 'message' => 'Club not found'], 404);
        }
    
        // Fetch events for the club
        $events = $eventModel->where('id_club', $id)->findAll();
        if (!$events) {
            log_message('error', 'No events found for club: ' . $id);
            return $this->response->setJSON(['status' => 'error', 'message' => 'No events found for club'], 404);
        }
    
        $eventDetails = [];
        foreach ($events as $event) {
            log_message('debug', 'Processing event: ' . json_encode($event));
            $clubDetails = $eventModel->getClub($event['id']);
            if ($clubDetails) {
                log_message('debug', 'Club details found: ' . json_encode($clubDetails));
                $eventDetails[] = [
                    'event_id' => $event['id'],
                    'event_name' => $event['name'],
                    'description' => $event['description'],
                    'location' => $event['location'],
                    'date' => $event['date'],
                    'picture' => $event['picture'],
                    'club_name' => $clubDetails->club_name,
                    'club_id' => $clubDetails->club_id
                ];
            } else {
                log_message('error', 'Club details not found for event: ' . $event['id']);
            }
        }
    
        return $this->response->setJSON(['status' => 'success', 'events' => $eventDetails]);
    }
}